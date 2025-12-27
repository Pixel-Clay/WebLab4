package com.lab.service;

import com.lab.dto.HistoryResponse;
import com.lab.dto.PointCheckResponse;
import com.lab.entity.PointResult;
import com.lab.entity.User;
import com.lab.repository.PointResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointService {
    private final PointResultRepository pointResultRepository;

    @Autowired
    public PointService(PointResultRepository pointResultRepository) {
        this.pointResultRepository = pointResultRepository;
    }

    public PointCheckResponse checkPoint(double x, double y, double r, User user) {
        long before = System.nanoTime();
        Instant currentInstant = Instant.now();

        boolean inRectangle = 0 <= x && x <= r && 0 <= y && y <= r;
        boolean inTriangle = x <= 0 && y >= 0 && y <= (r + x) / 2;
        boolean inQuarterCircle = x <= 0 && y <= 0 && (x * x + y * y) <= r * r;
        boolean success = inRectangle || inTriangle || inQuarterCircle;

        long calculationEnd = System.nanoTime();
        double calculationMs = (calculationEnd - before) / 1_000_000.0;
        String took = String.format("%.3f", calculationMs) + "ms";

        PointResult result = new PointResult(success, r, x, y, currentInstant.toString(), took);
        result.setUser(user);
        pointResultRepository.save(result);

        return new PointCheckResponse(success, r, x, y, currentInstant.toString(), took, user.getUsername());
    }

    public HistoryResponse getHistory(User user, int offset, int limit) {
        if (limit <= 0) {
            limit = 20;
        }
        if (limit > 100) {
            limit = 100;
        }
        if (offset < 0) {
            offset = 0;
        }

        int page = offset / limit;
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "time"));
        Page<PointResult> pageResult = pointResultRepository.findAllByOrderByTimeDesc(pageable);
        
        List<PointCheckResponse> data = pageResult.getContent().stream()
                .map(r -> new PointCheckResponse(
                        r.isSuccess(),
                        r.getR(),
                        r.getX(),
                        r.getY(),
                        r.getTime(),
                        r.getTook(),
                        r.getUser().getUsername()
                ))
                .collect(Collectors.toList());
        
        return new HistoryResponse(data, pageResult.getTotalElements(), offset, limit);
    }

    public void clearHistory(User user) {
        pointResultRepository.deleteAllByUser(user);
    }
}


