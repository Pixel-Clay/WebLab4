package com.lab.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "point_results")
public class PointResult implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "success", nullable = false)
    @JsonProperty("success")
    private boolean success;

    @Column(name = "r", nullable = false)
    @JsonProperty("r")
    private double r;

    @Column(name = "x", nullable = false)
    @JsonProperty("x")
    private double x;

    @Column(name = "y", nullable = false)
    @JsonProperty("y")
    private double y;

    @Column(name = "time")
    @JsonProperty("time")
    private String time;

    @Column(name = "took")
    @JsonProperty("took")
    private String took;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public PointResult() {
    }

    public PointResult(boolean success, double r, double x, double y) {
        this.success = success;
        this.r = r;
        this.x = x;
        this.y = y;
        this.time = Instant.now().toString();
        this.took = null;
    }

    public PointResult(boolean success, double r, double x, double y, String time, String took) {
        this.success = success;
        this.r = r;
        this.x = x;
        this.y = y;
        this.time = time;
        this.took = took;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}


