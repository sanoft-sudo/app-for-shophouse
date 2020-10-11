package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Trade extends AbsEntity {

    @Column(nullable = false)
    private Double amount;
    @Column(nullable = false)
    private Double retailPrice;

    private Double discountPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private TradeAll tradeAll;



}
