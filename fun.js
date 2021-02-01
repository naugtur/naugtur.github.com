(function (D) {

    function recur() {
        var elements, element, current,
            sections = D.getElementsByTagName('section');
        for (var i = 0, li = sections.length; i < li; i += 1) {
            current = sections[i];
            elements = [].slice.apply(current.getElementsByTagName('*'));
            for (var e = 0, le = elements.length; e < le; e += 1) {
                if(elements[e].parentNode===sections[i]){
                element = document.createElement('div');
                element.appendChild(elements[e]);
                current.appendChild(element);
                current = element;
                }
            }
        }
    }

    recur();

})(document)
