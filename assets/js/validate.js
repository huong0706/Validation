function Validation(options) {
    const formElement = document.querySelector(options.form);
    const submitElement = document.querySelector(options.submit);
    const selectorRules = {};
    function checkValidate(isInputValid) {
        if (!isInputValid) {
            submitElement.classList.add("disabled");
        } else {
            submitElement.classList.remove("disabled");
        }
    }
    function validate(inputElement, rule) {
        const errorElement = inputElement.parentElement.querySelector(options.error);
        const rules = selectorRules[rule.selector];
        for (let i = 0; i < rules.length; i++) {
            var errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");
            // inputElement.addEventListener("input", () => {
            //     errorElement.innerText = "";
            //     inputElement.parentElement.classList.remove("invalid");
            // });
            // }
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
        }
        return !errorMessage;
    }

    if (formElement) {
        formElement.addEventListener("submit", function (e) {
            e.preventDefault();
            options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);
                const isInputValid = validate(inputElement, rule);
                checkValidate(isInputValid);
            });
        });
        
        options.rules.forEach((rule) => {
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            const inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.addEventListener("input", () => {
                    const isInputValid = validate(inputElement, rule);
                    if (!isInputValid) {
                        submitElement.classList.add("disabled");
                    }

                });
            }
            if (inputElement) {
                inputElement.addEventListener("blur", () => {
                    const isInputValid = validate(inputElement, rule);
                    if (!isInputValid) {
                        submitElement.classList.add("disabled");
                    }
                });
            }
        });
    }
    
}
Validation.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này";
        },
    };
};
Validation.isName = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            const nameRegex =
                /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
            return nameRegex.test(value) ? undefined : "Tên không bao gồm các kí tự đặc biệt";
        },
    };
};
Validation.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return mailRegex.test(value) ? undefined : "Email không đúng định dạng";
        },
    };
};

Validation.isPassword = function (selector, min, max) {
    return {
        selector: selector,
        test: function (value) {
            const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z]).{8,32}$/;
            return passwordRegex.test(value)
                ? undefined
                : `Mật khẩu phải có độ dài từ ${min} - ${max} kí tự, ít nhất một chữ hoa và một chữ thường`;
        },
    };
};
Validation.isConfirmed = function (selector, getComfirm) {
    return {
        selector: selector,
        test: function (value) {
            return value === getComfirm() ? undefined : "Mật khẩu nhập lại không chính xác";
        },
    };
};
