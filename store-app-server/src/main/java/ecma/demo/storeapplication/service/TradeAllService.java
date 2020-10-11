package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomProduct;
import ecma.demo.storeapplication.entity.*;
import ecma.demo.storeapplication.entity.enums.PayType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqData;
import ecma.demo.storeapplication.payload.ReqTradeAll;
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
public class TradeAllService {
    @Autowired
    TradeAllRepository tradeAllRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    LoanRepository loanRepository;
    @Autowired
    DiscountRepository discountRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    TradeRepository tradeRepository;
    public HttpEntity<?> shoppingHistory(UUID clientId, String search, Integer size){
        return ResponseEntity.ok(new ApiResponse("success", true, tradeAllRepository.shoppingHistory(clientId, search, size)));
    }

    public HttpEntity<?> save(ReqTradeAll reqTradeAll) {

        try {
            Client client=null;

            if(reqTradeAll.getClientId()!=null){
                Optional<Client> optionalClient = clientRepository.findById(reqTradeAll.getClientId());
                if(optionalClient.isPresent()){
                    client=optionalClient.get();
                }
            }
            TradeAll tradeAll = tradeAllRepository.save(new TradeAll(reqTradeAll.getTotalSum(), reqTradeAll.getDiscount(), client));

            if (reqTradeAll.getDebt() !=null&&reqTradeAll.getDebt()!=0) {
                loanRepository.save(new Loan(reqTradeAll.getDebt(), null, client, tradeAll));
                tradeAll.setClient(client);
            }
            if (reqTradeAll.getCash() !=null&&reqTradeAll.getCash() !=0) {
                paymentRepository.save(new Payment(reqTradeAll.getCash(), PayType.CASH, tradeAll));
            }
            if (reqTradeAll.getCard() !=null&&reqTradeAll.getCard()!=0) {
                paymentRepository.save(new Payment(reqTradeAll.getCard(), PayType.CARD, tradeAll));
            }
            if (reqTradeAll.getBank() !=null&&reqTradeAll.getBank()!=0) {
                paymentRepository.save(new Payment(reqTradeAll.getBank(), PayType.BANK, tradeAll));
            }
            if (reqTradeAll.getDiscount() !=null&&reqTradeAll.getDiscount()!=0) {
                discountRepository.save(new Discount(reqTradeAll.getDiscount(), tradeAll));
            }

            for (ReqData data : reqTradeAll.getData()) {
                Product product = productRepository.findById(data.getProductId()).get();
                Trade trade = new Trade();
                trade.setAmount(data.getAmount());

                Double discountPrice=product.getRetailPrice()-data.getDiscountPrice();
                trade.setDiscountPrice(discountPrice);
                trade.setProduct(product);
                trade.setRetailPrice(product.getRetailPrice());
                trade.setTradeAll(tradeAll);
                tradeRepository.save(trade);
            }

            return ResponseEntity.ok(new ApiResponse("success", true));
        }catch (IllegalArgumentException e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
