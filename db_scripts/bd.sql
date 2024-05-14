CREATE TABLE users (
    user_id SERIAL NOT NULL CONSTRAINT user_pkey PRIMARY KEY, 
    username VARCHAR NOT NULL, 
    role VARCHAR NOT NULL, 
    password VARCHAR NOT NULL
);

CREATE TABLE poi (
    location_id SERIAL NOT NULL CONSTRAINT location_pkey PRIMARY KEY, 
    location_name VARCHAR NOT NULL, 
    location_address VARCHAR NOT NULL, 
    longitude DECIMAL NOT NULL, 
    latitude DECIMAL NOT NULL, 
    info TEXT, 
    image_url VARCHAR
);

CREATE TABLE favorite_routes (
    user_id INT NOT NULL,
    route_name VARCHAR NOT NULL,
    route_points INT[] NOT NULL, -- Array of POI IDs representing the route
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (user_id, route_name)
);

CREATE TABLE favorite_places (
    user_id INT NOT NULL, 
    poi_id INT NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users (user_id), 
    FOREIGN KEY (poi_id) REFERENCES poi (location_id), 
    PRIMARY KEY (user_id, poi_id)
);