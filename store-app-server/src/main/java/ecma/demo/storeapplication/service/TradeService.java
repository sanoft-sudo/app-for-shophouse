package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomStat;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.entity.Trade;
import ecma.demo.storeapplication.entity.TradeAll;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.ProductRepository;
import ecma.demo.storeapplication.repository.TradeAllRepository;
import ecma.demo.storeapplication.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TradeService {
    @Autowired
    TradeRepository tradeRepository;
    @Autowired
    TradeAllRepository tradeAllRepository;
    @Autowired
    ProductRepository productRepository;

    public HttpEntity<?> getTrade(UUID tradeAllId){
        return ResponseEntity.ok(new ApiResponse("success", true, tradeRepository.getTrade(tradeAllId)));
    }

//    public HttpEntity<?> save(ReqTrade reqTrade) {
//        List<Trade> tradeAllList = new ArrayList<>();
//        Product product = productRepository.findById(reqTrade.getProductId()).get();
//        TradeAll tradeAll = tradeAllRepository.findById(reqTrade.getTradeAllId()).get();
//        Trade trade = tradeRepository.save(new Trade(reqTrade.getAmount(),
//                reqTrade.getIsDiscount(),
//                product,
//                tradeAll,
//                reqTrade.getSalePrice()));
//        tradeAllList.add(trade);
//        List<Trade> trades = tradeRepository.saveAll(tradeAllList);
//        return ResponseEntity.ok(new ApiResponse("success",true, trades));
//    }
    public HttpEntity<?> getIncomeData(){
        try {
            return ResponseEntity.ok(new ApiResponse("success", true, tradeRepository.getIncomeData()));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getStat(String start, String end){
        try {
            List<CustomStat> stat = tradeRepository.getStat(start, end);
            return ResponseEntity.ok(new ApiResponse("success", true, stat));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
