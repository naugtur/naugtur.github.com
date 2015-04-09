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

    window.blag = function (d) {
        var row, 
            i=0,
            datarow=null,
            target = D.getElementById('blag'),
            data = d.data;
        if (target) {
            while(i<7 && data.length){
                datarow=data.shift();
                if(datarow.user.login==='naugtur'){
                row = document.createElement('div');
                row.innerHTML = datarow.body.replace(/\[([^\]]+)\]/g,'<a href="$1">$1</a>');
                target.appendChild(row);
                target = row;
                i++
                }
            }


        }
    }

        var sc = D.createElement('script');
        sc.src = 'https://api.github.com/repos/naugtur/naugtur.github.com/issues/comments?callback=blag&page=1&per_page=10&sort=updated&direction=desc';
        D.head.appendChild(sc);




        recur();

    })(document)
