package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomIncome;
import ecma.demo.storeapplication.custom.CustomStat;
import ecma.demo.storeapplication.custom.CustomTrade;
import ecma.demo.storeapplication.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TradeRepository extends JpaRepository<Trade, UUID> {
    @Query(value = "select (select p.name from product p where p.uuid=t.product_uuid) as product, " +
            "(select p.retail_price from product p where p.uuid=t.product_uuid) as price, " +
            "cast(t.uuid as varchar) as id, t.amount as amount, " +
            "coalesce (t.discount_price, 0) as discountPrice from trade t where t.trade_all_uuid=:tradeAllId", nativeQuery = true)
    List<CustomTrade> getTrade(UUID tradeAllId);

    List<Trade> findAllByProductId(UUID id);

    @Query(value = "select (select coalesce(sum(l.loan_sum), 0) from loan l) as loan, " +
            "(select coalesce(sum(lp.amount), 0) from loan_payment lp) as loan_payment, " +
            "(select coalesce(sum(w.amount*(select d.price from deliver d where d.uuid=w.deliver_uuid)), 0) " +
            "from waste w where w.waste_status='ACCEPTED') as waste, (select  coalesce(sum(p.received_sum), 0) " +
            "from payment p) as received, ((select coalesce(sum(t.discount_price), 0) from trade t)+(select coalesce(sum(all_discount_day.amount), 0) from discount all_discount_day)) as discount, " +
            "(select coalesce(sum(t.amount*t.retail_price), 0) from trade t) as trade, " +
            "(select coalesce(sum(d.price*d.amount), 0) from deliver d) as deliver, " +
            "(select coalesce(sum(do2.price*do2.amount), 0) from deliver_out do2) as deliver_out, " +
            "((select coalesce(sum(d.custom_cost), 0) from deliver d where d.currency_type='UZS')+" +
            "(select coalesce(sum(d.custom_cost*d.usd), 0) from deliver d where d.currency_type='USD')) " +
            "as custom_cost, ((select coalesce(sum(d.fare_cost), 0) from deliver d where d.currency_type='UZS')+" +
            "(select coalesce(sum(d.fare_cost*d.usd), 0) from deliver d where d.currency_type='USD')) as fare_cost, " +
            "((select coalesce(sum(d.other_costs), 0) from deliver d where d.currency_type='UZS')+" +
            "(select coalesce(sum(d.other_costs*d.usd), 0) from deliver d where d.currency_type='USD')) as other_costs", nativeQuery = true)
    CustomIncome getIncomeData();

    @Query(value = "SELECT DISTINCT To_char(dates.created_at, 'yyyy-mm-dd') AS created_at,( SELECT COALESCE(Sum(loan_payment_day.amount), 0) FROM loan_payment loan_payment_day WHERE To_char(loan_payment_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) AS loan_payment_sum, ( SELECT COALESCE(Sum(loan_day.loan_sum), 0) FROM loan loan_day WHERE To_char(loan_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') ) AS loan_sum, ( SELECT COALESCE(Sum(waste_day.amount * ( SELECT d.price FROM deliver d WHERE d.uuid = waste_day.deliver_uuid)), 0) FROM waste waste_day WHERE To_char(waste_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') ) AS waste_sum, ( SELECT COALESCE(Sum(cash_day.received_sum), 0) FROM payment cash_day WHERE To_char(cash_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') and cash_day.pay_type='CASH') AS cash_sum, ( SELECT COALESCE(Sum(card_day.received_sum), 0) FROM payment card_day WHERE To_char(card_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') and card_day.pay_type='CARD') AS card_sum, ( SELECT COALESCE(Sum(bank_day.received_sum), 0) FROM payment bank_day WHERE To_char(bank_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') and bank_day.pay_type='BANK') AS bank_sum, ( SELECT COALESCE(Sum(income_day.amount * income_day.retail_price), 0) FROM trade income_day WHERE To_char(income_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') ) AS income_sum, (( SELECT COALESCE(Sum(discount_day.discount_price), 0) FROM trade discount_day WHERE To_char(discount_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') )+(select coalesce(sum(all_discount_day.amount)) from discount all_discount_day  WHERE To_char(all_discount_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd'))) AS discount_sum, ( SELECT COALESCE(Sum(expense_day.price * expense_day.amount), 0) FROM deliver expense_day WHERE To_char(expense_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') ) AS expense_sum, ( ( SELECT COALESCE(Sum(custom_cost_day.custom_cost), 0) FROM deliver custom_cost_day WHERE To_char(custom_cost_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') AND custom_cost_day.currency_type = 'UZS') + ( SELECT COALESCE(Sum( custom_cost_day.custom_cost * custom_cost_day.price / custom_cost_day.usd), 0) FROM deliver custom_cost_day WHERE To_char(custom_cost_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') AND custom_cost_day.currency_type = 'USD') ) AS custom_cost_sum, ( ( SELECT COALESCE(Sum(fare_cost_day.fare_cost), 0) FROM deliver fare_cost_day WHERE To_char(fare_cost_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') AND fare_cost_day.currency_type = 'UZS') + ( SELECT COALESCE(Sum( fare_cost_day.fare_cost * fare_cost_day.price / fare_cost_day.usd), 0) FROM deliver fare_cost_day WHERE To_char(fare_cost_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') AND fare_cost_day.currency_type = 'USD') ) AS fare_cost_sum, ( ( SELECT COALESCE(Sum(other_costs_day.other_costs), 0) FROM deliver other_costs_day WHERE To_char(other_costs_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') AND other_costs_day.currency_type = 'UZS') + ( SELECT COALESCE(Sum( other_costs_day.other_costs * other_costs_day.price / other_costs_day.usd), 0) FROM deliver other_costs_day WHERE To_char(other_costs_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') AND other_costs_day.currency_type = 'USD') ) AS other_costs_sum FROM ( SELECT * FROM generate_series(Cast(:starts AS TIMESTAMP), Cast(:ends AS TIMESTAMP),interval '1 day') AS t(created_at) ) AS dates", nativeQuery = true)
    List<CustomStat> getStat(String starts, String ends);
}
