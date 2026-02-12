package com.lab.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class HistoryResponse {
    @JsonProperty("data")
    private List<PointCheckResponse> data;

    @JsonProperty("total")
    private long total;

    @JsonProperty("offset")
    private int offset;

    @JsonProperty("limit")
    private int limit;

    public HistoryResponse() {
    }

    public HistoryResponse(List<PointCheckResponse> data, long total, int offset, int limit) {
        this.data = data;
        this.total = total;
        this.offset = offset;
        this.limit = limit;
    }

    public List<PointCheckResponse> getData() {
        return data;
    }

    public void setData(List<PointCheckResponse> data) {
        this.data = data;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }
}
