package com.nus_iss.spring.backend.services;

import com.nus_iss.spring.backend.dtos.CartDto;
import com.nus_iss.spring.backend.dtos.AddToCartDto;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nus_iss.spring.backend.entities.Buyer;
import com.nus_iss.spring.backend.entities.Cart;
import com.nus_iss.spring.backend.entities.CartItem;
import com.nus_iss.spring.backend.entities.Product;
import com.nus_iss.spring.backend.mappers.CartMapper;
import com.nus_iss.spring.backend.repositories.BuyerRepository;
import com.nus_iss.spring.backend.repositories.CartItemRepository;
import com.nus_iss.spring.backend.repositories.CartRepository;
import com.nus_iss.spring.backend.repositories.ProductRepository;
import com.nus_iss.spring.backend.services.interfaces.CartService;
import com.nus_iss.spring.backend.services.interfaces.OrderService;

import jakarta.transaction.Transactional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private BuyerRepository buyerRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private OrderService orderService;
    @Autowired
    private CartMapper cartMapper;
    @Autowired
    private UserInfoService userService;

    private static final Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);


    @Transactional
    @Override
    public void addToCart(AddToCartDto cartItemDto) {
        Buyer buyer = buyerRepository.findByUsername(cartItemDto.getUsername())
            .orElseThrow(() -> new RuntimeException("Buyer does not exist!"));
        Cart cart = cartRepository.findByBuyer(buyer)
            .orElseThrow(() -> new RuntimeException("Cart does not exist!"));
        Product product = productRepository.findById(cartItemDto.getProductId())
            .orElseThrow(() -> new RuntimeException("Product does not exist!"));

        logger.info("cartItemDto: {}", cartItemDto);
        logger.info("product: {}", product);


        if (cartItemDto.getQuantity() > product.getStock()){
            throw new RuntimeException("Insufficient stock for product ID: " + product.getId());        }
        
        CartItem existingCartItem = cart.getCartItems().stream()
            .filter(item -> item.getProduct().getId() == cartItemDto.getProductId())
            .findFirst().orElse(null);

        logger.info("existingCartItem: {}", existingCartItem);
        if (existingCartItem != null){
            existingCartItem.setQuantity(existingCartItem.getQuantity() + cartItemDto.getQuantity());
            cartItemRepository.save(existingCartItem);
        }else{
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(cartItemDto.getQuantity());

            logger.info("cartItem: {}", cartItem);

            cart.getCartItems().add(cartItem);
        }

        cart.updateTotalAmount();
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void removeFromCart(AddToCartDto cartItemDto) {
        logger.info("UNDO COMMAND: {}", cartItemDto);
        Buyer buyer = buyerRepository.findByUsername(cartItemDto.getUsername())
            .orElseThrow(() -> new RuntimeException("Buyer does not exist!"));
        Cart cart = cartRepository.findByBuyer(buyer)
            .orElseThrow(() -> new RuntimeException("Cart does not exist!"));
        CartItem existingCartItem = cart.getCartItems().stream()
            .filter(item -> item.getProduct().getId() == cartItemDto.getProductId())
            .findFirst().orElse(null);

        if (existingCartItem != null) {
            cart.getCartItems().remove(existingCartItem);
            cartItemRepository.delete(existingCartItem);
        } else {
            throw new RuntimeException("Product does not exist in the cart!");
        }
        
        cart.updateTotalAmount();
        cartRepository.save(cart);
    }

    @Transactional
    @Override
    public void emptyCart(Long id) {
        logger.info("EMPTYCART: id {}", id);
        Cart cart = cartRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cart does not exist!"));
        cart.getCartItems().clear();
        cart.updateTotalAmount();
        cartRepository.save(cart);
    }

    @Transactional
    @Override
    public void checkoutCart(Long id) {
        Cart cart = cartRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cart does not exist!"));

        for (CartItem item : cart.getCartItems()){
            Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product does not exist!"));
            
            if (item.getQuantity() > product.getStock() || product.getStock() - item.getQuantity() < 0){
                throw new RuntimeException("Insufficient stock for product ID: " + product.getId());
            }

            product.setStock(product.getStock() - item.getQuantity());
            // update seller balance
            Double itemPrice = item.getQuantity() * product.getPrice();
            userService.updateUserBalance(
                product.getSeller().getUsername(), itemPrice, "ADD");
            productRepository.save(product);
        }

        orderService.createOrder(cart);
        this.emptyCart(id);
    }

    @Transactional
    @Override
    public CartDto getCartByUsername(String username) {
        Buyer buyer = buyerRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Wrong username!"));
        return cartMapper.toDto(buyer.getCart());
    }

    @Transactional
    @Override
    public Cart getCartById(Long id) {
        Cart cart = cartRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("No Cart!"));
        return cart;
    }

    

    @Override
    public void saveCart(Cart cart) {
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public CartDto getCartByUserId(Long userId) {
        Buyer buyer = buyerRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Wrong username!"));
        Cart cart = cartRepository.findByBuyer(buyer)
            .orElseThrow(() -> new RuntimeException("No Cart!"));
        return cartMapper.toDto(cart);
    }

    @Override
    @Transactional
    public CartDto getCartDtoById(Long id) {
        Cart cart = cartRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("No Cart!"));
        return cartMapper.toDto(cart);
    }

}
