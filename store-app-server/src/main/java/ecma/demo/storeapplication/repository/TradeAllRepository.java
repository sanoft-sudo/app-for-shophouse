package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomShoppingHistory;
import ecma.demo.storeapplication.entity.TradeAll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TradeAllRepository extends JpaRepository<TradeAll, UUID> {
    List<TradeAll> findAllByClientId(UUID clientId);

    @Query(value = "select cast(ta.uuid as varchar ) as id, ta.total_sum as total, (select concat(u.first_name,' ', u.last_name) from users u where u.uuid=ta.created_by_uuid) as salesman, ta.created_at as created, (select COALESCE(sum(l.loan_sum), 0) from loan l where trade_all_uuid=ta.uuid) as loan from trade_all ta where client_uuid=:client and (lower ((select concat(u.first_name,' ', u.last_name) from users u where u.uuid=ta.created_by_uuid)) like '%'||lower(:search)||'%' or cast(ta.total_sum as varchar) like '%'||lower(:search)||'%' or lower(substring(cast(ta.created_at as varchar), 0,11)) like '%'||lower(:search)||'%') order by ta.created_at limit :size", nativeQuery = true)
    List<CustomShoppingHistory> shoppingHistory(UUID client, String search, Integer size);

}
