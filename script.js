//----------------------------------------------------
for (let i = 0; i < Orders.length; i++)
{
	let orders = document.getElementsByClassName('orders');

	let order = document.createElement('div');
	order.classList.add('order');

	let leftNumDate = document.createElement('div');
	leftNumDate.classList.add('left-num-date');

	let orderNum = document.createElement('div');
	orderNum.classList.add('order-num');
	orderNum.innerHTML = 'Order ' + Orders[i].id;
	let orderDate = document.createElement('div');
	orderDate.classList.add('order-date');
	orderDate.innerHTML = Orders[i].OrderInfo.createdAt;

	let leftOrderInfo = document.createElement('div');
	leftOrderInfo.classList.add('left-order-info');

	let orderShipped = document.createElement('div');
	orderShipped.classList.add('order-shipped');
	orderShipped.innerHTML = '<p>' + Orders[i].OrderInfo.customer + '</p><p>Shipped: ' + Orders[i].OrderInfo.shippedAt + '</p>';
	let status = document.createElement('div');
	status.classList.add('status');
	status.innerHTML =  Orders[i].OrderInfo.status;


	leftOrderInfo.appendChild(orderShipped);
	leftOrderInfo.appendChild(status);

	leftNumDate.appendChild(orderNum);
	leftNumDate.appendChild(orderDate);

	order.appendChild(leftNumDate);
	order.appendChild(leftOrderInfo);

	orders[0].appendChild(order);
}
//--------------------------------------------

function searchOrders() 
{
	let input, filter, childOrders;
	input = document.getElementById('search-orders');
	filter = input.value.toUpperCase();
	childOrders = document.getElementsByClassName('order');
	for (let i = 0; i < childOrders.length; i++)
	{
		if (childOrders[i].innerText.toUpperCase().indexOf(filter) > -1)
		{
			childOrders[i].classList.remove('display-none');
		}
		else
		{
			childOrders[i].classList.add('display-none');
		}
	}
}

function searchItemsPC()
{
	let input, filter, childItems;
	input = document.getElementById('search-items-pc');
	filter = input.value.toUpperCase();
	childItems = document.getElementsByClassName('item-1');
	for (let i = 0; i < childItems.length; i++)
	{
		if (childItems[i].innerText.toUpperCase().indexOf(filter) > -1)
		{
			childItems[i].classList.remove('display-none');
		}
		else
		{
			childItems[i].classList.add('display-none');
		}
	}
}

function searchItemsPhone()
{
	let input, filter, childItems;
	input = document.getElementById('search-items-phone');
	filter = input.value.toUpperCase();
	childItems = document.getElementsByClassName('item-2');
	for (let i = 0; i < childItems.length; i++)
	{
		if (childItems[i].innerText.toUpperCase().indexOf(filter) > -1 )
		{
			childItems[i].classList.remove('display-none');
		}
		else if (('UNIT PRICE').indexOf(filter) > -1 || ('QUANTITY').indexOf(filter) > -1 || ('TOTAL').indexOf(filter) > -1)
		{
			childItems[i].classList.add('display-none');
		}
		else 
		{
			childItems[i].classList.add('display-none');
		}
	}
}
//-------------------------------------------------------------

function ShippingAdress()
{
	let elem1 = document.getElementsByClassName('shopping');
	elem1[0].classList.remove('display-none');
	let elem2 = document.getElementsByClassName('customer');
	elem2[0].classList.add('display-none');
	let backGrClrCar = document.getElementsByClassName('svg-car');
	backGrClrCar[0].classList.add('back-gr-clr');
	let borderBttmCar = document.getElementsByClassName('border-svg-car');
	borderBttmCar[0].classList.add('brdr-bottom');
	let backGrClrMan = document.getElementsByClassName('svg-man');
	backGrClrMan[0].classList.remove('back-gr-clr');
	let borderBttmMan = document.getElementsByClassName('border-svg-man');
	borderBttmMan[0].classList.remove('brdr-bottom');
}

function CustomerInfo()
{
	let elem1 = document.getElementsByClassName('shopping');
	elem1[0].classList.add('display-none');
	let elem2 = document.getElementsByClassName('customer');
	elem2[0].classList.remove('display-none');
	let backGrClrCar = document.getElementsByClassName('svg-car');
	backGrClrCar[0].classList.remove('back-gr-clr');
	let borderBttmCar = document.getElementsByClassName('border-svg-car');
	borderBttmCar[0].classList.remove('brdr-bottom');
	let backGrClrMan = document.getElementsByClassName('svg-man');
	backGrClrMan[0].classList.add('back-gr-clr');
	let borderBttmMan = document.getElementsByClassName('border-svg-man');
	borderBttmMan[0].classList.add('brdr-bottom');
}
//----------------------------------------------------------------------