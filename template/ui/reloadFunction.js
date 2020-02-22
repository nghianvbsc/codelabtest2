function handleChangeCount() {
    $(".button").on("click", function () {
        let $button = $(this);
        let oldValue = $button.parent().find("input").val();
        let newVal;
        if ($button.text() === "+") {
            // alert('+++++++');
            newVal = parseFloat(oldValue) + 1;
            if (newVal > Number($button.parent().find("input").attr('max'))) {
                newVal = Number($button.parent().find("input").attr('max'));
            }
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }

            if (newVal < Number($button.parent().find("input").attr('min'))) {
                newVal = Number($button.parent().find("input").attr('min'));
            }
        }

        $button.parent().find("input").val(newVal).trigger('change');
    });

    $('.input-number').on('paste change keyup', function () {
        let val = $(this).val();
        let min = Number($(this).attr('min'));
        let max = Number($(this).attr('max'));
        if (Number(val)) {
            if (val > max) {
                val = max;
            }

            if (val < min) {
                val = min;
            }
        } else {
            val = min;
        }
        $(this).val(val);
    })
}