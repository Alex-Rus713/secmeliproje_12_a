CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

CREATE INDEX idx_favorites_game_id ON favorites(game_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

