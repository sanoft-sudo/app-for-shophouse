package ecma.demo.storeapplication.custom;

import org.springframework.beans.factory.annotation.Value;

public interface CustomStat {

    @Value("#{target.created_at}")
    String getName();
    @Value("#{target.loan_payment_sum}")
    Double getLoanPayment();
    @Value("#{target.loan_sum}")
    Double getLoan();
    @Value("#{target.waste_sum}")
    Double getWaste();
    @Value("#{target.cash_sum}")
    Double getCash();
    @Value("#{target.card_sum}")
    Double getCard();
    @Value("#{target.bank_sum}")
    Double getBank();
    @Value("#{target.income_sum}")
    Double getIncome();
    @Value("#{target.discount_sum}")
    Double getDiscount();
    @Value("#{target.expense_sum}")
    Double getExpense();
    @Value("#{target.custom_cost_sum}")
    Double getCustomCost();
    @Value("#{target.fare_cost_sum}")
    Double getFareCost();
    @Value("#{target.other_costs_sum}")
    Double getOtherCosts();
}
