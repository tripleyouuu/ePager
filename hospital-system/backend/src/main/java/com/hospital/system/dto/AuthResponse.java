package com.hospital.system.dto;

import com.hospital.system.entity.Role;

public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private Role role;

    public AuthResponse(String token, String userId, String name, String email, Role role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public String getToken() {
        return token;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public static class AuthResponseBuilder {
        private String token;
        private String userId;
        private String name;
        private String email;
        private Role role;

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public AuthResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AuthResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AuthResponseBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(token, userId, name, email, role);
        }
    }
}
