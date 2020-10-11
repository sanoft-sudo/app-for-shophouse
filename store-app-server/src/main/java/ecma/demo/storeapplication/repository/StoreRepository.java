package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StoreRepository extends JpaRepository<Store, UUID> {
}
