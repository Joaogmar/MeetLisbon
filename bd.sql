CREATE TABLE users (
    user_id SERIAL NOT NULL CONSTRAINT user_pkey PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE poi (
    location_id SERIAL NOT NULL CONSTRAINT location_pkey PRIMARY KEY,
    location_name VARCHAR NOT NULL,
    longitude DECIMAL NOT NULL,
    latitude DECIMAL NOT NULL,
    info TEXT
);

CREATE TABLE routes (
    route_id SERIAL NOT NULL CONSTRAINT route_pkey PRIMARY KEY
);

CREATE TABLE favorite_routes (
    user_id INT NOT NULL,
    route_id INT NOT NULL,
    route_order INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    PRIMARY KEY (user_id, route_id),
    CONSTRAINT route_order_check CHECK (route_order > 0) 
);

CREATE TABLE route_poi (
    route_id INT NOT NULL,
    poi_id INT NOT NULL,
    poi_order INT NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    FOREIGN KEY (poi_id) REFERENCES poi(location_id),
    PRIMARY KEY (route_id, poi_id),
    CONSTRAINT poi_order_check CHECK (poi_order > 0) 
);
