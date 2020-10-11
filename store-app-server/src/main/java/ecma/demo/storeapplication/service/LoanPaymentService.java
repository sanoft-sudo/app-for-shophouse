package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomDebt;
import ecma.demo.storeapplication.entity.LoanPayment;
import ecma.demo.storeapplication.entity.enums.PayType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqLoanPayment;
import ecma.demo.storeapplication.repository.ClientRepository;
import ecma.demo.storeapplication.repository.LoanPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LoanPaymentService {
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    LoanPaymentRepository loanPaymentRepository;

    public HttpEntity<?> saveLoanPayment(ReqLoanPayment reqLoanPayment){
        try {
            PayType payType = PayType.valueOf(reqLoanPayment.getType());
            LoanPayment loanPayment=new LoanPayment(reqLoanPayment.getAmount(), clientRepository.findById(reqLoanPayment.getClient()).get(), payType);

            return ResponseEntity.ok(new ApiResponse("success", true, loanPaymentRepository.save(loanPayment)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> getDebtHistory(UUID client, String search, Integer size){
        List<CustomDebt> debtHistory = loanPaymentRepository.getDebtHistory(client, search, size);
        return ResponseEntity.ok(new ApiResponse("success", true, debtHistory));
    }
}
