package com.nus_iss.spring.decorators;

import com.nus_iss.spring.decorators.interfaces.ProductComponent;

public abstract class ProductDecorator implements ProductComponent {
    protected ProductComponent product;
}