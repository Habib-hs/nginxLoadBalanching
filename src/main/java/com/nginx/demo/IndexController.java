package com.nginx.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class IndexController {
    @Value("${APP_ID:default}")
    private String appId;

    @GetMapping("/")
    public ModelAndView index() {
        ModelAndView mav = new ModelAndView("index");
        mav.addObject("appId", appId);
        return mav;
    }

    // API endpoint that returns live stock prices - should NOT be cached
    @GetMapping("/api/live-stock-price")
    @ResponseBody
    public ResponseEntity<String> getLiveStockPrice() {
        double stockPrice = 100 + Math.random() * 50; // Simulate a random stock price
        String response = String.format("Server: %s | Live Stock Price: $%.2f", appId, stockPrice);

        // Set headers to prevent caching
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");

        return ResponseEntity.ok().headers(headers).body(response);
    }

    // API endpoint with a cached product list - nginx will cache this
    @GetMapping("/api/cached-product-list")
    @ResponseBody
    public ResponseEntity<String> getCachedProductList() {
        String response = String.format("Server: %s | Product List: [Laptop, Phone, Tablet]", appId);

        // Set headers that allow caching
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "public, max-age=30"); // Cache for 30 seconds

        return ResponseEntity.ok().headers(headers).body(response);
    }
}