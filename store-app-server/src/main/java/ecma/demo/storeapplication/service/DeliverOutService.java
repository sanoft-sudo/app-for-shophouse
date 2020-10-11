package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomStoreProduct;
import ecma.demo.storeapplication.entity.Deliver;
import ecma.demo.storeapplication.entity.DeliverOut;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.entity.Store;
import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqDeliverOut;
import ecma.demo.storeapplication.repository.DeliverOutRepository;
import ecma.demo.storeapplication.repository.ProductRepository;
import ecma.demo.storeapplication.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DeliverOutService {
    @Autowired
    DeliverOutRepository deliverOutRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    StoreRepository storeRepository;

    public HttpEntity<?> save(ReqDeliverOut reqDeliverOut) {
        try {
            Product product = productRepository.findById(reqDeliverOut.getProductId()).get();
            Store store = storeRepository.findById(reqDeliverOut.getStoreId()).get();
            CustomStoreProduct storeProduct = productRepository.findStoreProduct(product.getId()).get(0);
            if (storeProduct.getEnding_amount() >= reqDeliverOut.getAmount()) {
                DeliverOut save = deliverOutRepository.save(new DeliverOut(reqDeliverOut.getAmount(), product, store, reqDeliverOut.getPrice(), reqDeliverOut.getUsd(), CurrencyType.valueOf(reqDeliverOut.getCurrency())));
                return ResponseEntity.ok(new ApiResponse("success", true, save));
            }
            return ResponseEntity.ok(new ApiResponse("failed", false));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> getProductHistory(UUID productId){
        List<DeliverOut> deliverOuts = deliverOutRepository.findAllByProductId(productId);
        return ResponseEntity.ok(new ApiResponse("suucess", true, deliverOuts));
    }

}