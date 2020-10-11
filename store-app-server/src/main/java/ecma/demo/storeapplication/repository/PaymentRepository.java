package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
}
