var createCustomTabGroup = function(settings) {

	if (Titanium.Platform.name == 'android') {
		throw "CustomTabGroup error: This is only supported by iPhone!";
	}

	var tabbar =  Ti.UI.createTabGroup(settings);

	var fakeTabBgs = [];

	var fakeTabs = [];
    
        var currentTab = {};
    
        var currentTabIndex = 0;

	var tallest_tab = 50;

        //Only 'cross the bridge' once
        var is_ipad = Ti.Platform.model !== 'iPad' && Ti.Platform.model !== 'iPad Simulator' ? false : true; 

	function addTab(object) {

		tabbar.addTab(object);

		if(object.tabBarHidden === true) {
			Ti.API.info('tabBarHidden is not currently supported by CustomTabBar and will be ignored');

			delete object.tabBarHidden;
		}

		if(object.custom == true) {
			fakeTabBg = Ti.UI.createView({
				height: 49,
				index: tabbar.tabs.length - 1,
				bottom:0,
				backgroundImage: '/tabbar_module/images/tabbar.png',
				defaultImage: '/tabbar_module/images/tabbar.png',
				selectedImage: object.selectedImage || '/tabbar_module/images/tabbar_h.png',
				borderRadius:8
			});

			tabImage = Ti.UI.createImageView({
				image: tabbar.tabs[ tabbar.tabs.length - 1 ].icon,
				defaultImage: tabbar.tabs[ tabbar.tabs.length - 1 ].icon,
				selectedImage: tabbar.tabs[ tabbar.tabs.length - 1 ].selectedIcon,
				bottom:0,
				index: tabbar.tabs.length - 1,
				height:49,
				width: tabbar.tabs[ tabbar.tabs.length - 1 ].imageWidth || 'auto',
				touchEnabled: false,
				preventDefaultImage: true
			});

			if(object.title !== undefined) {
				tabTitle = Ti.UI.createLabel({
					text: object.title,
					bottom:0,
					height:'auto',
					width:'auto',
					font: {
						fontSize:10,
						fontWeight:'bold'
					},
					color:'#fff',
					touchEnabled: false
				});

				tabImage.bottom = 0;

				fakeTabBg.add(tabTitle);
			}

			if(object.badge !== null ) {
				throw "CustomTabGroup error: badges can not be set on custom tabs";
			}

			if(object.modal === true && tabbar.tabs.length == 1) {
				throw "CustomTabGroup error: The first window can not be a modal window";
			}

			if(object.modal === true) {
				fakeTabBg.addEventListener('click', function(e) {
					object.window.open({
						modal:true
					});
				});
			} else if(typeof(object.onClick) == 'function') {
				fakeTabBg.touchEnabled = true;
				fakeTabBg.addEventListener('click', function(e) {
					object.onClick();
				});
			} else {
				fakeTabBg.touchEnabled = false;
			}

			/**
			 * We add the tab images separate if they are larger then the normal tab space allows
			 * however this CAN hit the limit of items that can be added to a tabgroup bar (5 items)
			 */
            if(object.custom !== undefined || object.custom === true) {
                fakeTabs.push(tabImage);

                if(object.tabHeight > tallest_tab) {
                    tallest_tab = object.tabHeight;
                }
            } else {
                fakeTabs.push({
                    index:tabbar.tabs.length - 1
                });
                fakeTabBg.add(tabImage);
                if(object.badge !== undefined) {
                    //fakeTab.add(tabBadge);
                }
            }

			fakeTabBgs.push(fakeTabBg);
		} else {
			fakeTabBgs.push(false);
			fakeTabs.push(false);
		}

		return;
	}
    
    function align() {
		for(i=0; i<fakeTabBgs.length; i++) {
			if(fakeTabBgs[i] !== false) {
				// calculate tab bg width and position
				var margin

				if(is_ipad) {
					width = 80;
				} else {
				    margin = (tabbar.tabs.length - 1) * 2;

					width = (tabbar.width / tabbar.tabs.length) - margin;
                }

                if(is_ipad) {
                    
                    // The iPad does not use any kind of math to dictate the spacing… :(
                    switch(tabbar.tabs.length) {
                        case 2: 
                            margin = 26;
                        break;
                        case 3: 
                            margin = 32;
                        break;
                        case 4: 
                            margin = 31.5;
                        break;
                        case 5: 
                        case 6: 
                        case 7: 
                            margin = 30;
                        break;
                        default:
                            margin = 0;
                        break;
                    }
                    
                    // this is the distance from the left of tab 1
                    var b = (fakeTabBgs.length * width) + ((fakeTabBgs.length - 1) * margin);
                    
                    base_left = (tabbar.width / 2) - (b/2);
                     
                    b = null;                 

                    var left = base_left + ((fakeTabBgs[i].index * width) + (margin * i));
                    
                } else {
                    base_left = 0;
                                        
                    var left = fakeTabBgs[i].index === 0 ? 4 : (width * fakeTabBgs[i].index) + (4 + (margin * (fakeTabBgs[i].index)));
                    Ti.API.info(left);
                }

                fakeTabBgs[i].width = width;
                fakeTabBgs[i].left = left;
                
				/**
				 * We add the tab images seperate if they are larger then the normal tab space allows
				 * however this CAN hit the limit of items that can be added to a tabgroup bar (5 items)
				 */
				if(tabbar.tabs[ fakeTabBgs[i].index ].custom === true) {

					fakeTabs[i].height = tabbar.tabs[ fakeTabs[i].index ].imageHeight > 49 ? tabbar.tabs[ fakeTabs[i].index ].imageHeight : 49;

					if(tabbar.tabs[ fakeTabBgs[i].index ].imageWidth !== undefined && tabbar.tabs[ fakeTabBgs[i].index ].imageWidth >= width) {
                        offset = (tabbar.tabs[ fakeTabBgs[i].index ].imageWidth - width) / 2;
                        
                        fakeTabs[i].width = tabbar.tabs[ fakeTabBgs[i].index ].imageWidth;
                        fakeTabs[i].left = left - offset;

					}

				}
			}
		}
    }

	function open() {
        
        //get the numbers and apply them to the objects
        align();

	    // loop through to add the objects
		for(i=0; i<fakeTabBgs.length; i++) {
			if(fakeTabBgs[i] !== false) {
            
                tabbar.add(fakeTabBgs[i]);

				if(tabbar.tabs[ fakeTabBgs[i].index ].custom === true) {

					if(tabbar.tabs[ fakeTabBgs[i].index ].imageWidth !== undefined && tabbar.tabs[ fakeTabBgs[i].index ].imageWidth >= width) {
                                              
                        tabbar.add(fakeTabs[i]);
                        
                        tabbar.tabs[i].icon = null;

					} else {
						fakeTabBgs[i].add(fakeTabs[i]);
						tabbar.tabs[i].icon = null;

					}

				}
			}
		}

		tabbar.addEventListener('focus', function(e) {
			tabbar._activeTab = e.tab
			tabbar._activeTabIndex = e.index
			if ( tabbar._activeTabIndex == -1)
				return;

			// create set active tab
			currentTab = tabbar._activeTab;
			currentTabIndex = tabbar._activeTabIndex;
		});
        
        Ti.Gesture.addEventListener('orientationchange', function(e) {
            // wait till the rotation is 1/2 way done
            setTimeout(function() {
                align();
            },200);
        });

		tabbar.addEventListener('focus', function(e) {
			if(e.previousIndex !== undefined && e.previousIndex >= 0 && fakeTabBgs[e.previousIndex] !== undefined) {
				fakeTabBgs[e.previousIndex].backgroundImage = fakeTabBgs[e.index].defaultImage;
			}
			if(e.index !== undefined && e.index >= 0 && fakeTabBgs[e.index] !== undefined) {
				fakeTabBgs[e.index].backgroundImage = fakeTabBgs[e.index].selectedImage;
			}
		});
		tabbar.open();
		return;
	}

	function removeTab(object) {
		if(object.custom == true) {
			// This causes issues with too much digging threw arrays...
			throw "CustomTabGroup error: Custom tabs can not be removed...";
		}

		tabbar.removeTab(object);

		return;
	}

	function setActiveTab(index_object) {

		if(typeof(index_object) == 'number') {

			index_object = tabbar.tabs[index_object];

		}

		if(index_object.modal == true) {

			index_object.window.open({
				modal:true
			});

		} else {

			tabbar.setActiveTab(index_object);

		}

		return;
	}

	function hideTabBar() {
		down = tallest_tab + 2;
		tabbar.animate({
			bottom:-down,
			duration:0
		});
	}

	function showTabBar() {
		tabbar.animate({
			bottom:0,
			duration:0
		});
	}

	return {

		//We create our own versions of these
		open: function() {
			open()
		},
		addTab: function(object) {
			addTab(object)
		},
		removeTab: function(object) {
			removeTab(object)
		},
		setActiveTab: function(index_object) {
			setActiveTab(index_object)
		},
		hideTabBar: function() {
			hideTabBar();
		},
		showTabBar: function() {
			showTabBar();
		},
        
		//Pass directly to the native tabgroup
		remove: function(object) {
			tabbar.remove(object)
		},
		addEventListener: function(type, fun) {
			tabbar.addEventListener(type, fun)
		},
		animate: function(object) {
			tabbar.animate(object)
		},
		close: function() {
			tabbar.close()
		},
		fireEvent: function(type) {
			tabbar.fireEvent(type)
		},
		removeEventListener: function(name, callback) {
			tabbar.removeEventListener(name, callback)
		},
		add: function(object) {
			tabbar.add(object);
		},
		hide: function() {
			tabbar.hide();
		},
		show: function() {
			tabbar.show();
		},
		toImage : function() {
			tabbar.toImage()
		},
        
		//Access to the tabs from the outside
		tabs: tabbar.tabs,
        
        //Some nice things to have
        currentTab : currentTab,
        currentTabIndex : currentTabIndex
	};
};