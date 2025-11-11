package com.Payment.Gateway.Repository;

import com.Payment.Gateway.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {

    Optional<Order> findByPayhereOrderId(String payhereOrderId);
}
