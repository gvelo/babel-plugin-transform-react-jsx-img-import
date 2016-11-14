var profile = <div>
  <img src="avatar.png" srcSet="images/img1.jpg, images/img2.jpg 2x, img1.jpg 3x" className="profile" />
  <h3>{[user.firstName, user.lastName].join(' ')}</h3>
</div>;
