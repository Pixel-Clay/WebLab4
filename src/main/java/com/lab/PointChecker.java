package com.lab;

import com.lab.entity.PointResult;

public class PointChecker {
    
    public static PointResult handlePointCheck(double x, double y, double r) {
        boolean inRectangle = 0 <= x && x <= r && 0 <= y && y <= r;
        
        boolean inTriangle = x <= 0 && y >= 0 && y <= (r + x) / 2;
        
        boolean inQuarterCircle = x <= 0 && y <= 0 && (x * x + y * y) <= r * r;
                        
        boolean success = inRectangle || inTriangle || inQuarterCircle;
        
        return new PointResult(success, r, x, y);
    }
}
