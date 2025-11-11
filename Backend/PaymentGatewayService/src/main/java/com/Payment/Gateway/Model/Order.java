package com.Payment.Gateway.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId; // Maps to PayHere order_id

    @Column(unique = true, nullable = false)
    private String payhereOrderId;

    private double amount;
    private String currency;
    private String customerEmail;

    // Status can be: PENDING, PAID, FAILED, CANCELED
    private String paymentStatus;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Order() {
    }

    public Order(double amount, LocalDateTime createdAt, String currency, String customerEmail, Long orderId, String payhereOrderId, String paymentStatus) {
        this.amount = amount;
        this.createdAt = createdAt;
        this.currency = currency;
        this.customerEmail = customerEmail;
        this.orderId = orderId;
        this.payhereOrderId = payhereOrderId;
        this.paymentStatus = paymentStatus;
    }

    public Order(String payhereOrderId, double amount, String currency, String email) {
        this.payhereOrderId = payhereOrderId;
        this.amount = amount;
        this.currency = currency;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPayhereOrderId() {
        return payhereOrderId;
    }

    public void setPayhereOrderId(String payhereOrderId) {
        this.payhereOrderId = payhereOrderId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
