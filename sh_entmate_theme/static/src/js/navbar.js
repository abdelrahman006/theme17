/** @odoo-module **/
import { MenuDropdown, MenuItem, NavBar } from '@web/webclient/navbar/navbar';
import { isMobileOS } from "@web/core/browser/feature_detection";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";

import { jsonrpc } from "@web/core/network/rpc_service";
import { onWillStart } from "@odoo/owl";

var app_icon_style = 'style_1';
var backend_all_icon_style = 'backend_fontawesome_icon';

patch(NavBar.prototype, {
    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    /**
     * @override
     */

    setup() {
            super.setup();
            this.orm = useService("orm");
            this.searchTheme()
        },

     async searchTheme() {
            const data = await this.orm.searchRead(
            "sh.ent.theme.config.settings",
            [],
            ["app_icon_style","backend_all_icon_style"]
            );
             if (data) {
                    if (data[0]['app_icon_style']) {
                        app_icon_style = data[0]['app_icon_style'];
                    }
                    if (data[0]['backend_all_icon_style']) {
                        backend_all_icon_style = data[0]['backend_all_icon_style'];
                    }
                }
     },

    onNavBarDropdownItemSelection(menu) {
        if(window.event.shiftKey){
            localStorage.setItem("sh_add_tab",1)
        }else{
            localStorage.setItem("sh_add_tab",0)
        }
        if(this.websiteCustomMenus){
            const websiteMenu = this.websiteCustomMenus.get(menu.xmlid);
            if (websiteMenu) {
                return this.websiteCustomMenus.open(menu);
            }
        }
       
        if (menu) {
            this.menuService.selectMenu(menu);
        }
    },
    onNavBarDropdownItemClick(ev) {
        if(ev.shiftKey){
            localStorage.setItem("sh_add_tab",1)
        }else{
            localStorage.setItem("sh_add_tab",0)
        }
    },
    getAppClassName(app){
        var app_name = app.xmlid
        return app_name.replaceAll('.', '_')
    },
    getIconStyle() {
        return app_icon_style;
    },
    getBackend_icon(){
        return backend_all_icon_style;
    },
    isMobile(ev) {
        return isMobileOS;
    },
    click_secondary_submenu(ev) {
        if (isMobileOS) {
            $(".sh_sub_menu_div").addClass("o_hidden");
        }

        $(".o_menu_sections").removeClass("show")
    },
    click_close_submenu(ev) {
        $(".sh_sub_menu_div").addClass("o_hidden");
        $(".o_menu_sections").removeClass("show")
    },
    click_mobile_toggle(ev) {
        $(".sh_sub_menu_div").removeClass("o_hidden");
    },
    click_app_toggle(ev) {
        /* close pop-ups */
        $(".todo_layout").removeClass("sh_theme_model")
        $('.sh_wqm_quick_menu_submenu_list_cls').css('display','none')
        $('.o_user_bookmark_menu').removeClass('bookmark_active')
        $('.backmate_theme_layout').removeClass("sh_theme_model");
        $('.sh_calc_util').removeClass("active")
        $(".sh_calc_results").html("");

        if($(".sh_entmate_theme_appmenu_div").hasClass("sh_first_load")){
            $(".sh_entmate_theme_appmenu_div").removeClass("show")
            $(".sh_entmate_theme_appmenu_div").removeClass("sh_first_load")
        }
        if ($(".sh_entmate_theme_appmenu_div").hasClass("show")) {
            $("body").removeClass("sh_sidebar_background_enterprise");
            $(".sh_search_container").css("display", "none");

            $(".sh_entmate_theme_appmenu_div").removeClass("show")
            $(".o_action_manager").removeClass("d-none");
            $(".o_menu_brand").css("display", "block");
            $(".full").removeClass("sidebar_arrow");
            $(".o_menu_sections").css("display", "flex");
        } else {
            $(".sh_entmate_theme_appmenu_div").addClass("show")
            $("body").addClass("sh_sidebar_background_enterprise");
            $(".sh_entmate_theme_appmenu_div").css("opacity", "1");
            // 24-3-2023 // 
            // to fix issue of list view column width//
            // $(".o_action_manager").addClass("d-none");
            $(".full").addClass("sidebar_arrow");
            $(".o_menu_brand").css("display", "none");
            $(".o_menu_sections").css("display", "none");
        }
    },
});


