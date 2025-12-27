package com.lab.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PointCheckResponse {
    @JsonProperty("success")
    private boolean success;

    @JsonProperty("r")
    private double r;

    @JsonProperty("x")
    private double x;

    @JsonProperty("y")
    private double y;

    @JsonProperty("time")
    private String time;

    @JsonProperty("took")
    private String took;

    @JsonProperty("username")
    private String username;

    public PointCheckResponse() {
    }

    public PointCheckResponse(boolean success, double r, double x, double y, String time, String took) {
        this.success = success;
        this.r = r;
        this.x = x;
        this.y = y;
        this.time = time;
        this.took = took;
    }

    public PointCheckResponse(boolean success, double r, double x, double y, String time, String took, String username) {
        this.success = success;
        this.r = r;
        this.x = x;
        this.y = y;
        this.time = time;
        this.took = took;
        this.username = username;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getTook() {
        return took;
    }

    public void setTook(String took) {
        this.took = took;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}


