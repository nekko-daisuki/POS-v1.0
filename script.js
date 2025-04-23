document.addEventListener('DOMContentLoaded', function() {
  // 商品データ (実際にはデータベースやAPIから取得することを想定)
  const menuItems = {
      coffee: [
          {name: 'コーヒー', price: 300},
          {name: '浅煎り', price: 320},
          {name: '深煎り', price: 320},
          {name: 'スペシャル', price: 400},
          {name: 'デカフェ', price: 350},
          {name: 'アイス', price: 350},
          {name: 'アイスカフェ', price: 400}
      ],
      tea: [
          {name: 'ソフトドリンク', price: 250},
          {name: 'レモンティー', price: 300},
          {name: 'りんご', price: 300},
          {name: 'ミルクティー', price: 350},
          {name: 'ティー', price: 300}
      ],
      food: [
          {name: 'フード', price: 400},
          {name: 'チョコ', price: 250},
          {name: 'サンドイッチ', price: 450},
          {name: 'ケーキ', price: 500}
      ],
      other: [
          {name: 'その他1', price: 200},
          {name: 'その他2', price: 300}
      ]
  };
  
  // 注文データを保持する配列
  let orderItems = [];
  let totalAmount = 0;
  let totalCount = 0;
  let receivedAmount = 0;
  
  // DOM要素の取得
  const orderList = document.getElementById('orderList');
  const orderSummary = document.getElementById('orderSummary');
  const paymentBtn = document.getElementById('paymentBtn');
  const cancelOrderBtn = document.getElementById('cancelOrderBtn');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const menuItemBtns = document.querySelectorAll('.menu-item-btn');
  const paymentScreen = document.getElementById('paymentScreen');
  const paymentTotal = document.getElementById('paymentTotal');
  const receivedAmountDisplay = document.getElementById('receivedAmount');
  const changeAmountDisplay = document.getElementById('changeAmount');
  const numKeys = document.querySelectorAll('.num-key');
  const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
  const completeBtn = document.getElementById('completeBtn');
  
  // 会計画面が最初から表示されないようにする
  paymentScreen.classList.add('hidden');
  
  // カテゴリータブの切り替え処理
  categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
          // アクティブなカテゴリーを更新
          categoryBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          
          // カテゴリーコンテンツの表示/非表示を切り替え
          const categoryId = this.getAttribute('data-category');
          document.querySelectorAll('.category-content').forEach(content => {
              content.classList.add('hidden');
          });
          document.getElementById(categoryId + '-menu').classList.remove('hidden');
      });
  });
  
  // メニューアイテムのクリックイベント
  menuItemBtns.forEach(btn => {
      btn.addEventListener('click', function() {
          const itemName = this.getAttribute('data-name');
          const itemPrice = parseInt(this.getAttribute('data-price'));
          
          // 既存のアイテムかどうかチェック
          const existingItemIndex = orderItems.findIndex(item => item.name === itemName);
          
          if (existingItemIndex !== -1) {
              // 既存のアイテムの場合は数量を増加
              orderItems[existingItemIndex].quantity++;
          } else {
              // 新しいアイテムの場合は注文リストに追加
              orderItems.push({
                  name: itemName,
                  price: itemPrice,
                  quantity: 1
              });
          }
          
          // 注文リストを更新
          updateOrderList();
      });
  });
  
  // 注文リストの更新関数
  function updateOrderList() {
      // 注文リストをクリア
      orderList.innerHTML = '';
      
      // 合計金額と合計点数を初期化
      totalAmount = 0;
      totalCount = 0;
      
      // 各注文アイテムについて処理
      orderItems.forEach((item, index) => {
          // 注文アイテムの要素を作成
          const orderItemElement = document.createElement('div');
          orderItemElement.className = 'order-item';
          
          // 注文アイテム名
          const nameElement = document.createElement('div');
          nameElement.className = 'order-item-name';
          nameElement.textContent = `${item.name}`;
          
          // 数量コントロール
          const quantityControl = document.createElement('div');
          quantityControl.className = 'quantity-control';
          
          // マイナスボタン
          const minusBtn = document.createElement('button');
          minusBtn.className = 'quantity-btn';
          minusBtn.textContent = '-';
          minusBtn.addEventListener('click', function() {
              if (item.quantity > 1) {
                  item.quantity--;
              } else {
                  // 数量が1の場合は削除
                  orderItems.splice(index, 1);
              }
              updateOrderList();
          });
          
          // 数量入力欄
          const quantityInput = document.createElement('input');
          quantityInput.className = 'quantity-input';
          quantityInput.type = 'text';
          quantityInput.value = item.quantity;
          quantityInput.readOnly = true;
          
          // プラスボタン
          const plusBtn = document.createElement('button');
          plusBtn.className = 'quantity-btn';
          plusBtn.textContent = '+';
          plusBtn.addEventListener('click', function() {
              item.quantity++;
              updateOrderList();
          });
          
          // 数量コントロールに子要素を追加
          quantityControl.appendChild(minusBtn);
          quantityControl.appendChild(quantityInput);
          quantityControl.appendChild(plusBtn);
          
          // 注文アイテムに子要素を追加
          orderItemElement.appendChild(nameElement);
          orderItemElement.appendChild(quantityControl);
          
          // 注文リストに追加
          orderList.appendChild(orderItemElement);
          
          // 合計金額と点数を更新
          totalAmount += item.price * item.quantity;
          totalCount += item.quantity;
      });
      
      // 合計表示を更新
      orderSummary.textContent = `${totalCount}点 合計 ¥${totalAmount}`;
  }
  
  // 注文取り消しボタンのクリックイベント
  cancelOrderBtn.addEventListener('click', function() {
      orderItems = [];
      updateOrderList();
  });
  
  // 支払いボタンのクリックイベント
  paymentBtn.addEventListener('click', function() {
      if (orderItems.length === 0) {
          alert('注文アイテムがありません');
          return;
      }
      
      // 支払い画面を表示
      paymentScreen.classList.remove('hidden');
      paymentTotal.textContent = `合計 ¥${totalAmount}`;
      receivedAmount = 0;
      updatePaymentDisplay();
  });
  
  // 数字キーパッドのクリックイベント
  numKeys.forEach(key => {
      key.addEventListener('click', function() {
          const keyValue = this.textContent;
          
          if (keyValue === 'C') {
              // 削除キー
              receivedAmount = Math.floor(0);
          } else if (keyValue === '00') {
              // 00キー
              receivedAmount = receivedAmount * 100;
          } else {
              // 数字キー
              receivedAmount = receivedAmount * 10 + parseInt(keyValue);
          }
          
          updatePaymentDisplay();
      });
  });
  
  // 支払い表示の更新関数
  function updatePaymentDisplay() {
      receivedAmountDisplay.textContent = `¥${receivedAmount}`;
      const change = receivedAmount - totalAmount;
      changeAmountDisplay.textContent = `¥${Math.max(0, change)}`;
      
      // お釣りがマイナスの場合はボタンを無効化
      if (change < 0) {
          completeBtn.disabled = true;
          completeBtn.style.opacity = 0.5;
      } else {
          completeBtn.disabled = false;
          completeBtn.style.opacity = 1;
      }
  }
  
  // 支払いキャンセルボタンのクリックイベント
    cancelPaymentBtn.addEventListener('click', function() {
      paymentScreen.classList.add('hidden');
  });
  
  // 会計完了ボタンのクリックイベント
    completeBtn.addEventListener('click', function() {
        if (receivedAmount < totalAmount) {
            alert('預り金額が不足しています');
            return;
        }
    
    // おつりを計算
    const changeAmount = receivedAmount - totalAmount;
    
    // スプレッドシートに送信する処理
    try {
        saveToSpreadsheet();
        
        // 注文をリセット
        orderItems = [];
        updateOrderList();
        
        // 支払い画面を閉じる
        paymentScreen.classList.add('hidden');
        
        // 完了メッセージを表示
        alert('支払いが完了しました。\nおつり：¥' + changeAmount);
    } catch (error) {
        alert('エラーが発生しました: ' + error.message);
    }
});
  
  // スプレッドシートに送信する関数
  function saveToSpreadsheet() {

      fetch('https://script.google.com/macros/s/AKfycby4Q9CaF1tSf3HsdS2aHIZOIfTZBKLutsSJwtq2WD8ZiVAL-aZR3WFpWbBYh8Xgym6d/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              timestamp: new Date().toISOString(),
              items: orderItems,
              totalAmount: totalAmount,
              totalCount: totalCount,
              receivedAmount: receivedAmount,
              changeAmount: receivedAmount - totalAmount
          })
      })
      .then(response => console.log('注文データを送信しました'))
      .catch(error => console.error('エラー:', error));
  }
});
