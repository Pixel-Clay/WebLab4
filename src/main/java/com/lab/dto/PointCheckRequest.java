package com.lab.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

public class PointCheckRequest {
    @NotNull(message = "X is required")
    @DecimalMin(value = "-3.0", message = "X must be >= -3")
    @DecimalMax(value = "5.0", message = "X must be <= 5")
    private Double x;

    @NotNull(message = "Y is required")
    @DecimalMin(value = "-3.0", message = "Y must be >= -3")
    @DecimalMax(value = "5.0", message = "Y must be <= 5")
    private Double y;

    @NotNull(message = "R is required")
    @DecimalMin(value = "-3.0", message = "R must be >= -3")
    @DecimalMax(value = "5.0", message = "R must be <= 5")
    private Double r;

    public PointCheckRequest() {
    }

    public PointCheckRequest(Double x, Double y, Double r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }
}


