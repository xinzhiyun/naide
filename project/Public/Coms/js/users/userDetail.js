// 实例化vue
var detail = new Vue({
    el: ".main",
    data() {
        return {
            // 用户列表
            userList: {},
            // 设备列表
            devicesList: [],
        }
    },
    methods: {

    }
});
// 设备详情 小圆圈
function circle(obj, color, percent) {
    var bar = new ProgressBar.Circle(obj, {
        color: '#aaa',
        strokeWidth: 7,
        trailWidth: 5,
        easing: 'easeInOut',
        duration: 1400,
        text: {
            autoStyleContainer: false
        },
        from: { color: color, width: 5 },
        to: { color: color, width: 7 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);
            var value = Math.round(circle.value() * 100) + '%';
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(value);
            }

        } 
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '.5rem';
    bar.animate(percent);  // 占得百分比  
}
// 调用设备详情小圆圈
// circle('container1', "#51CEE4", .7);
// circle('container2', "#42D5B8", .7);
// circle('container3', "#AD6BD0", .7);
// circle('container4', "#F08686", .7);
// circle('container5', "#F8A56D", .7);
// circle('container6', "#51CEE4", .7);
// circle('container7', "#42D5B8", .7);
// circle('container8', "#AD6BD0", .7);
// circle('container9', "#F08686", .7);
// circle('container10', "#F8A56D", .7);