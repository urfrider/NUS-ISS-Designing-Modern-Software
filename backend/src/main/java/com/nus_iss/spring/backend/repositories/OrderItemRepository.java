package com.nus_iss.spring.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nus_iss.spring.backend.entities.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query(value = "SELECT * FROM order_items WHERE seller_id = :sellerId", nativeQuery = true)
    List<OrderItem> findBySeller_Id(Long sellerId);
}
