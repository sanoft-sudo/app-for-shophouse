package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomDebt;
import ecma.demo.storeapplication.entity.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface LoanPaymentRepository extends JpaRepository<LoanPayment, UUID> {
    List<LoanPayment> findAllByClientId(UUID client);
    @Query(value = "select * from (select lp.created_at as created, lp.amount as amount, (select coalesce(sum(lp2.amount), 0) from loan_payment lp2 where lp2.created_at<=lp.created_at and lp2.client_uuid=:client)-(select coalesce(sum(l2.loan_sum), 0) from loan l2 where l2.created_at<=lp.created_at and l2.client_uuid=:client) as sum,  false as loan from loan_payment lp where lp.client_uuid=:client union select l.created_at as created, l.loan_sum as amount, (select coalesce(sum(lp2.amount), 0) from loan_payment lp2 where lp2.created_at<=l.created_at and lp2.client_uuid=:client)-(select coalesce(sum(l2.loan_sum), 0) from loan l2 where l2.created_at<=l.created_at), true as loan from loan l where l.client_uuid=:client and l.client_uuid=:client) t where (substring(cast(t.created as varchar), 0,11) like '%'||lower(:search)||'%' or cast(t.amount as varchar) like '%'||lower(:search)||'%' or cast(t.sum as varchar) like '%'||lower(:search)||'%') order by t.created limit :size", nativeQuery = true)
    List<CustomDebt> getDebtHistory(UUID client, String search, Integer size);
}
