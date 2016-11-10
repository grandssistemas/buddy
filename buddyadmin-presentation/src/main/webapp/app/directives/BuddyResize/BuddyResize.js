define([], function(){
    BuddyResize.$inject = [];
    
    function BuddyResize(){
        return {
            restrict: 'A',
            scope: {
                dependents: '='
            }
            ,link: function(scope,element){
                scope.$watch(function(){
                    return element.css('height');
                },function(newH){
                    scope.dependents.forEach(function(el){
                        var htmlEl = angular.element(document.querySelector('#'.concat(el)));
                        htmlEl.attr('style',htmlEl.attr('style').replace(new RegExp('max-height:.*px'),'max-height: '+ newH))
                    })
                })
            }
        }
        
    }
    
    return BuddyResize;
})