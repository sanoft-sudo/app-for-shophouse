package ecma.demo.storeapplication.config;

import ecma.demo.storeapplication.entity.Role;
import ecma.demo.storeapplication.entity.Settings;
import ecma.demo.storeapplication.entity.User;
import ecma.demo.storeapplication.entity.enums.RoleName;
import ecma.demo.storeapplication.repository.AttachmentRepository;
import ecma.demo.storeapplication.repository.RoleRepository;
import ecma.demo.storeapplication.repository.SettingsRepository;
import ecma.demo.storeapplication.repository.UserRepository;
import ecma.demo.storeapplication.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Value("${spring.datasource.initialization-mode}")
    private String initialMode;

    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    SettingsRepository settingsRepository;

    @Autowired
    AttachmentRepository attachmentRepository;

    @Override
    public void run(String... args) {
        if (initialMode.equalsIgnoreCase("always")){

            userRepository.saveAll(Arrays.asList(
                    new User(
                            "Sanjar",
                            "Juraev",
                            "+998977088389",
                            "AA",
                            "6121419",
                            "admin",
                            passwordEncoder.encode("root123"),
                            roleRepository.saveAll(Arrays.asList(
                                    new Role(10, RoleName.ROLE_DIRECTOR,"admin")
                            ))
                    ),
                    new User(
                            "Sanjar",
                            "Juraev",
                            "+998970000000",
                            "AA",
                            "0000000",
                            "clerk",
                            passwordEncoder.encode("root123"),
                            roleRepository.saveAll(Arrays.asList(
                                    new Role(20, RoleName.ROLE_WAREHOUSE,"warehouse")
                            ))
                    ),
                    new User(
                            "Sanjar",
                            "Juraev",
                            "+998971111111",
                            "AA",
                            "0000000",
                            "cashier",
                            passwordEncoder.encode("root123"),
                            roleRepository.saveAll(Arrays.asList(
                                    new Role(30, RoleName.ROLE_CASHIER,"cashier")
                            ))
                    )

            ));

            settingsRepository.save(new Settings((double) 10000));
        }
    }
}
