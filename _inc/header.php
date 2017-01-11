<input type="checkbox" id="is-sp-checkbox" />
<div class="page">
<header>
<div class="page-header">
	<div class="logo-main" role="banner">
		<?php if ($pid == "top"): ?><h1><img src="<?php echo $base_path; ?>img/common/logo.png" alt="" /></h1>
		<?php else: ?><p><a href="<?php echo $base_path; ?>"><img src="<?php echo $base_path; ?>img/common/logo.png" alt="" /></a></p>
		<?php endif; ?>
	</div>

	<div class="nav-main" id="js-nav-main">
		<nav role="navigation" class="nav-main__inner">
			<ul class="nav-main__list">
				<li><a<?php if ($pid == 'top'):?> class="is-current" <?php endif; ?> href="<?php echo $base_path; ?>">HOME</a></li>
			</ul>
		</nav>
	</div>
</div><!-- /.page-header -->
</header>
