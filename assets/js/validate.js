function Validation(options) {
    const formElement = document.querySelector(options.form);
    const selectorRules = {};

    //Check invalid form
    function checkValidate(parentElements, submitElement) {
        let isFormValid = true;
        parentElements.forEach((parentElement) => {
            if (parentElement.classList.contains("invalid")) {
                isFormValid = false;
            }
        });
        //Disable/enable submit button
        if (!isFormValid) {
            submitElement.classList.add("disabled");
        } else {
            submitElement.classList.remove("disabled");
        }
        return isFormValid;
    }
    // Show error message
    function validate(inputElement, rule) {
        const errorElement = inputElement.parentElement.querySelector(".form__message");
        const rules = selectorRules[rule.selector];
        for (let i = 0; i < rules.length; i++) {
            var errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
        }
    }

    if (formElement) {
        const parentElements = document.querySelectorAll(".form__item");
        const submitElement = formElement.querySelector(".form__submit");
        const modalNotify = formElement.querySelector(".modal");
        const modalBtn = formElement.querySelector(".modal__button");

        formElement.addEventListener("submit", function (e) {
            e.preventDefault();
        });

        submitElement.addEventListener("click", function () {
            options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule);
            });
            const isFormValid = checkValidate(parentElements, submitElement);
            if (isFormValid) {
                if (modalNotify.classList.contains("hidden")) {
                    modalNotify.classList.remove("hidden");
                }
                modalNotify.classList.add("active");
            }
        });
        modalBtn.addEventListener("click", () => {
            if (modalNotify.classList.contains("active")) {
                modalNotify.classList.remove("active");
            }
            modalNotify.classList.add("hidden");
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
                    validate(inputElement, rule);
                    checkValidate(parentElements, submitElement);
                });
            }
            // if (inputElement) {
            //     inputElement.addEventListener("blur", () => {
            //         validate(inputElement, rule);
            //         checkValidate(parentElements, submitElement);
            //     });
            // }
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
