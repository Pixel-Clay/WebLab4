package com.lab.repository;

import com.lab.entity.PointResult;
import com.lab.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointResultRepository extends JpaRepository<PointResult, Long> {
    List<PointResult> findAllByUserOrderByTimeDesc(User user);
    List<PointResult> findAllByOrderByTimeDesc();
    Page<PointResult> findAllByOrderByTimeDesc(Pageable pageable);
    void deleteAllByUser(User user);
}


