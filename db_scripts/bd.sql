CREATE TABLE users (
    user_id SERIAL NOT NULL,
    username VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (user_id),
    CONSTRAINT username_unique UNIQUE (username)
);

CREATE TABLE poi (
    location_id SERIAL NOT NULL,
    location_name VARCHAR NOT NULL,
    location_address VARCHAR NOT NULL,
    longitude DECIMAL NOT NULL,
    latitude DECIMAL NOT NULL,
    info TEXT,
    image_url VARCHAR,
    CONSTRAINT location_pkey PRIMARY KEY (location_id)
);

CREATE TABLE favorite_routes (
    user_id INT NOT NULL,
    route_name VARCHAR NOT NULL,
    route_points INT NOT NULL,
    fr_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, route_name)
);

CREATE TABLE favorite_places (
    user_id INT NOT NULL,
    poi_id INT NOT NULL,
    fp_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (poi_id) REFERENCES poi (location_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, poi_id)
);
CREATE TABLE Route_History (
    route_id INT NOT NULL,
    rh_action VARCHAR NOT NULL,
    date TIMESTAMP NOT NULL 
    metrica VARCHAR NOT NULL,
    user_id INT NOT NULL,
    poi_id INT NOT NULL,
    fp_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (fr_id) REFERENCES favorite_routes (fr_id) ON DELETE CASCADE,
    FOREIGN KEY (fp_id) REFERENCES favorite_places (fp_id) ON DELETE CASCADE,
    FOREIGN KEY (poi_id) REFERENCES poi (location_id) ON DELETE CASCADE,
    PRIMARY KEY (route_id)
);
