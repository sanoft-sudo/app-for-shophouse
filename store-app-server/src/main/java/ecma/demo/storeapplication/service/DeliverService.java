package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomProduct;
import ecma.demo.storeapplication.custom.CustomStoreProduct;
import ecma.demo.storeapplication.entity.Deliver;
import ecma.demo.storeapplication.entity.DeliverAll;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.entity.Trade;
import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqDeliver;
import ecma.demo.storeapplication.payload.ReqDeliverAll;
import ecma.demo.storeapplication.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliverService {
    @Autowired
    DeliverRepository deliverRepository;
    @Autowired
    DeliverAllRepository deliverAllRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    TradeRepository tradeRepository;
    @Autowired
    SettingsRepository settingsRepository;

    public HttpEntity<?> save(ReqDeliverAll reqDeliverAll){
        try {
            DeliverAll deliverAll = deliverAllRepository.save(new DeliverAll(reqDeliverAll.getDescription()));
            List<Deliver> delivers=new ArrayList<>();

            for (ReqDeliver reqDeliver : reqDeliverAll.getReqDelivers()) {
                Product product = productRepository.findById(reqDeliver.getProductId()).get();
//                if(optionalProduct.isPresent()){
                    product.setCurrencyType(CurrencyType.valueOf(reqDeliver.getCurrency()));
                    product.setPrice(reqDeliver.getPrice());
                    product.setJuan(reqDeliver.getJuan());
                    product.setRetailPrice(reqDeliver.getRetailPrice());
                    product.setFullSalePrice(reqDeliver.getFullSalePrice());
                    product.setCustomCost(reqDeliver.getCustomCost());
                    product.setFareCost(reqDeliver.getFareCost());
                    product.setOtherCosts(reqDeliver.getOtherCosts());
                    Product save = productRepository.save(product);

                    Deliver deliver=new Deliver(reqDeliver.getAmount(), save, deliverAll, reqDeliver.getPrice(), settingsRepository.findAll().get(0).getUsd(), CurrencyType.valueOf(reqDeliver.getCurrency()), reqDeliver.getCustomCost(), reqDeliver.getFareCost(), reqDeliver.getOtherCosts(), reqDeliver.getJuan());
                    delivers.add(deliver);
//                }
            }
            List<Deliver> savedDelivers = deliverRepository.saveAll(delivers);
            return ResponseEntity.ok(new ApiResponse("success", true, savedDelivers));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> getProductHistory(UUID productId){
        List<Deliver> delivers = deliverRepository.findAllByProductId(productId);
        return ResponseEntity.ok(new ApiResponse("suucess", true, delivers));
    }
    public HttpEntity<?> deleteDeliver(UUID id){
        try {
            Deliver deliver = deliverRepository.findById(id).get();
            CustomStoreProduct customStoreProduct = productRepository.findStoreProduct(deliver.getProduct().getId()).get(0);
            Double amount= customStoreProduct.getDeliver_amount()-customStoreProduct.getTrade_amount()-customStoreProduct.getWaste_amount();
            if(deliver.getAmount()>amount){
                return ResponseEntity.ok(new ApiResponse("failed", false, deliver));
            }else {
                deliverRepository.delete(deliver);
                return ResponseEntity.ok(new ApiResponse("success", true));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
