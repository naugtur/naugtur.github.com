var module = (function () {

    var last = document.querySelector('#wrapper');


    var someFunction;

    return {
        run: function () {
            for (var i = 0; i < 100; i++) {
                var d = document.createElement('div');
                d.innerHTML = i;

                last.appendChild(d);
                last = d;
            }

            d = document.createElement('span');
            d.innerHTML = 'last in tree';

            someFunction = function () {
                console.log(i, d);
            }

            last.appendChild(d);
            last = d;

        },
        clean: function () {
            var wrapper = document.querySelector('#wrapper');
            wrapper.parentNode.removeChild(wrapper); //empty
            last = null;
        }
    }
})();