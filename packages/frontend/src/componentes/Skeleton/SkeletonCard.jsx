import React from 'react';
import './Skeleton.css';

export const OrderCardSkeleton = () => {
    return (
        <div className="skeleton-order-card">
            <div className="skeleton-order-header">
                <div className="skeleton-order-info">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-date"></div>
                    <div className="skeleton skeleton-buyer"></div>
                </div>
                <div className="skeleton skeleton-status"></div>
            </div>

            <div className="skeleton-order-body">
                <div className="skeleton skeleton-cart-title"></div>
                <div className="skeleton skeleton-item"></div>
                <div className="skeleton skeleton-item"></div>
                <div className="skeleton skeleton-item"></div>
            </div>

            <div className="skeleton-order-footer">
                <div className="skeleton skeleton-total"></div>
                <div className="skeleton skeleton-button"></div>
            </div>
        </div>
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="skeleton-product-card">
            <div className="skeleton skeleton-product-image"></div>
            <div className="skeleton-product-info">
                <div className="skeleton skeleton-product-title"></div>
                <div className="skeleton skeleton-product-price"></div>
                <div className="skeleton skeleton-product-seller"></div>
            </div>
        </div>
    );
};

export const ProductDetailSkeleton = () => {
    return (
        <div className="skeleton-product-detail">
            <div className="skeleton-detail-images">
                <div className="skeleton-thumbnails">
                    <div className="skeleton skeleton-thumbnail"></div>
                    <div className="skeleton skeleton-thumbnail"></div>
                    <div className="skeleton skeleton-thumbnail"></div>
                    <div className="skeleton skeleton-thumbnail"></div>
                </div>
                <div className="skeleton skeleton-main-image"></div>
            </div>

            <div className="skeleton-detail-info">
                <div className="skeleton skeleton-detail-title"></div>
                <div className="skeleton skeleton-detail-seller"></div>
                <div className="skeleton skeleton-detail-price"></div>
                <div className="skeleton skeleton-detail-description"></div>

                <div className="skeleton-detail-categories">
                    <div className="skeleton skeleton-category"></div>
                    <div className="skeleton skeleton-category"></div>
                    <div className="skeleton skeleton-category"></div>
                </div>

                <div className="skeleton skeleton-detail-stock"></div>

                <div className="skeleton-detail-actions">
                    <div className="skeleton skeleton-quantity-selector"></div>
                    <div className="skeleton skeleton-add-button"></div>
                </div>
            </div>
        </div>
    );
};
