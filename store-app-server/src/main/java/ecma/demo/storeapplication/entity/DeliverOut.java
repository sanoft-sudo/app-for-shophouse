package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliverOut extends AbsEntity {
    @Column(nullable = false)
    private Double amount;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private Store store;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double usd;

    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;
}
