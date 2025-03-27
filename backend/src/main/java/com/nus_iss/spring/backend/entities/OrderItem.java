package com.nus_iss.spring.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nus_iss.spring.backend.state.CancelledState;
import com.nus_iss.spring.backend.state.DeliveredState;
import com.nus_iss.spring.backend.state.PendingState;
import com.nus_iss.spring.backend.state.ShippingState;
import com.nus_iss.spring.backend.state.interfaces.OrderItemState;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore    
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    private int quantity;
    private double price;
    private String status;

    @Transient
    private OrderItemState state;

    @PostLoad
    public void initState(){
        switch (status) {
            case "SHIPPING":
                this.state = new ShippingState();
                break;
            case "DELIVERED":
                this.state = new DeliveredState();
                break;
            case "CANCELLED":
                this.state = new CancelledState();
                break;
            default:
                this.state = new PendingState();
                break;
        }
    }

    public void nextState() {
        state.next(this);
    }

    public void cancel() {
        state.cancel(this);
    }

    public void setState(OrderItemState state) {
        this.state = state;
        this.status = state.getStatus();
    }
}
