package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.DeliverOut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface DeliverOutRepository extends JpaRepository<DeliverOut, UUID> {
    List<DeliverOut> findAllByProductId(UUID id);
}
