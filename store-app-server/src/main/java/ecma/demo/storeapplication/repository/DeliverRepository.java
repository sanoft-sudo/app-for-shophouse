package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomDeliver;
import ecma.demo.storeapplication.entity.Deliver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DeliverRepository extends JpaRepository<Deliver, UUID> {

    @Query(value = "select p.uuid, p.name, p.price, " +
            "(select c.name from category c where c.uuid = p.category_uuid), " +
            "((select sum(d.amount) from deliver d where d.product_uuid = p.uuid) - " +
            "(select sum(t.amount) from trade t where t.product_uuid = p.uuid)) " +
            "from product p where p.uuid = :productId or p.name like ('%'||:search||'%') " +
            "group by p.uuid, p.name", nativeQuery = true)
    Page<CustomDeliver> getAllDelivers(Pageable pageable, UUID productId, String search);

    @Query(value = "select ((select coalesce(sum(d.amount),0) from deliver d where d.product_uuid = p.uuid) - " +
            "(select coalesce(sum(t.amount),0) from trade t where t.product_uuid = p.uuid) - " +
            "(select coalesce(sum(w.amount),0) from waste w where w.deliver_uuid = " +
            "(select d2.uuid from deliver d2 where d2.product_uuid = p.uuid))) as total " +
            "from product p where p.uuid = :id", nativeQuery = true)
    Double productAmount(UUID id);

    List<Deliver> findAllByProductId(UUID productId);
}
