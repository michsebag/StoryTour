            var map;
            var geocoder;
            var queuCounter;
            var setLimit;
            var totalAddedMarkers;
            var errorArray;

            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: 0, lng: 0},
                    zoom: 3
                });
                geocoder = new google.maps.Geocoder();
                queuCounter = 0;
                setLimit = 20;
                totalAddedMarkers = 0;
                errorArray = [];
            }

            document.getElementById('uploadButton').addEventListener('click', openDialog);

            function openDialog() {
              document.getElementById('fileuploader').click();
            }

            document.getElementById("myBtn").addEventListener("click", function () {
                document.getElementById("progress").innerHTML = "";
                document.getElementById("fileuploader").value = "";
                initMap();
            }, true);

            //will fire 20 ajax request at a time and other will keep in queue

            //keep count of added markers and update at top


            //function to get random element from an array
            (function ($) {
                $.rand = function (arg) {
                    if ($.isArray(arg)) {
                        return arg[$.rand(arg.length)];
                    } else if (typeof arg === "number") {
                        return Math.floor(Math.random() * arg);
                    } else {
                        return 4;  // chosen by fair dice roll
                    }
                };
            })(jQuery);

            //make an array of geocode keys to avoid the overlimit error
            var geoCodKeys = ['AIzaSyAJPLFGNDqnY9sBLWQ1k2MXazAWT1hanHE'];


            function addMarkers(addresses) {
            console.log('addMarkers started with:',addresses);
                var data = JSON.parse(addresses);
                $.each(data.locations, function (i, value) {
                    addMarker(value);
                });
                document.getElementById("progress").innerHTML = "Done.";
            }

            function addMarker(address, queKey) {
                var key = jQuery.rand(geoCodKeys);
                var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + key + '&address=' + address + '&sensor=false';

                var qyName = '';
                if (queKey) {
                    qyName = queKey;
                } else {
                    qyName = 'MyQueue' + queuCounter;
                }

                $.ajaxq(qyName, {
                    url: url,
                    dataType: 'json'
                }).done(function (data) {
                    var address = getParameterByName('address', this.url);
                    var index = errorArray.indexOf(address);
                    try {
                        var p = data.results[0].geometry.location;
                        var latlng = new google.maps.LatLng(p.lat, p.lng);
                        new google.maps.Marker({
                            position: latlng,
                            map: map
                        });
                        totalAddedMarkers++;
                        $("#totalAddedMarker").text(totalAddedMarkers);
                        //update adde marker count
                        if (index > -1) {
                            errorArray.splice(index, 1);
                        }
                    } catch (e) {
                        if (data.status = 'ZERO_RESULTS')
                            return false;

                        //on error call add marker function for same address
                        //and keep in Error ajax queue
                        addMarker(address, 'Errror');
                        if (index == -1) {
                            errorArray.push(address);
                        }
                    }
                });

                //mentain ajax queue set
                queuCounter++;
                if (queuCounter == setLimit) {
                    queuCounter = 0;
                }
            }

            //function get url parameter from url string
            getParameterByName = function (name, href) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(href);
                if (results == null)
                    return "";
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            }


             function openFile(event) {
             console.log('open file started');
                 var input = event.target;

                 var reader = new FileReader();
                 reader.onload = function () {
                     var text = reader.result;
                     document.getElementById("progress").innerHTML = "In Progress.";
                     $.ajax({
                         type: "POST",
                         url: "/geolocations",
                         data: text,
                         success: function (text) {
                         console.log('open file success, calling add markers');
                             addMarkers(text)
                         },
                         // dataType: "text"
                     });

                 };
                 reader.readAsText(input.files[0]);
             };








