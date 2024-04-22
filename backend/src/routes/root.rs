use super::auth;
use crate::config::database::Database;
use crate::middleware::auth as auth_middleware;
use crate::routes::{profile, register};
use crate::state::auth_state::AuthState;
use crate::state::token_state::TokenState;
use crate::state::user_state::UserState;
use axum::routing::{get, IntoMakeService};
use axum::{middleware, Router, http::{Method, header}};
use std::sync::Arc;
use tower::ServiceBuilder;
use tower_http::trace::TraceLayer;
use tower_http::cors::{Any, CorsLayer};

pub fn routes(db_conn: Arc<Database>) -> IntoMakeService<Router> {
    let merged_router = {
        let auth_state = AuthState::new(&db_conn);
        let user_state = UserState::new(&db_conn);
        let token_state = TokenState::new(&db_conn);

        auth::routes()
            .with_state(auth_state)
            .merge(register::routes().with_state(user_state))
            .merge(profile::routes().layer(ServiceBuilder::new().layer(
                middleware::from_fn_with_state(token_state, auth_middleware::auth),
            )))
            .merge(Router::new().route("/health", get(|| async { "Healthy..." })))
    };

    let cors = CorsLayer::new()
    //.allow_origin(tower_http::cors::AllowOrigin::exact("http://192.168.11.2:3001".parse().unwrap(),))
    .allow_origin(tower_http::cors::AllowOrigin::predicate(|origin, _| {
        origin.as_bytes().starts_with(b"http://127.0.0.1:5001")
    }))
    .allow_credentials(true)
    .allow_headers(vec![
        axum::http::header::ACCEPT,
        axum::http::header::AUTHORIZATION,
        axum::http::header::CONTENT_TYPE,  
    ])
    .allow_methods([axum::http::Method::GET, axum::http::Method::POST]);

    let app_router = Router::new()
    .nest("/api", merged_router)    
    .layer(cors)
    .layer(TraceLayer::new_for_http());

    app_router.into_make_service()
}
