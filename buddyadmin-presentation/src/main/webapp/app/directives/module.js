define(['angular'
    ,'./BuddyResize/BuddyResize'
]
    ,function(angular
    ,BuddyResize){

        angular.module('buddyadmin.core',[])
            .directive('buddyResize',BuddyResize)

})